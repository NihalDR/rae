use crate::platform::{
    exe_path_from_hwnd, get_icon_base64_from_exe, get_packaged_app_icon_from_hwnd,
    get_window_icon_base64_from_hwnd, get_window_title,
};
use std::collections::HashMap;
use std::{thread, time::Duration};
use tauri::{AppHandle, Emitter};
use winapi::shared::windef::HWND as WinHWND;
use winapi::um::winuser::GetForegroundWindow;

#[tauri::command]
pub fn start_window_watch(app: AppHandle) {
    thread::spawn(move || {
        let mut last_hwnd: Option<WinHWND> = None;
        let mut icon_cache: HashMap<WinHWND, (String, String)> = HashMap::new();

        loop {
            unsafe {
                let hwnd = GetForegroundWindow();
                if !hwnd.is_null() && Some(hwnd) != last_hwnd {
                    last_hwnd = Some(hwnd);

                    // Check cache first
                    let (app_name, icon_data) = if let Some(cached) = icon_cache.get(&hwnd) {
                        cached.clone()
                    } else {
                        // Extract app name
                        let mut app_name = get_window_title(hwnd);
                        if app_name.is_empty() {
                            if let Some(exe_path) = exe_path_from_hwnd(hwnd) {
                                app_name = exe_path
                                    .file_stem()
                                    .and_then(|s| s.to_str())
                                    .unwrap_or("")
                                    .to_string();
                            }
                        }

                        // Extract icon (try fastest method first)
                        let icon_base64 = get_window_icon_base64_from_hwnd(hwnd)
                            .or_else(|| get_packaged_app_icon_from_hwnd(hwnd));

                        let icon_data = if let Some(icon) = icon_base64 {
                            format!("data:image/png;base64,{}", icon)
                        } else {
                            // Fallback to exe icon if needed, but cache it
                            exe_path_from_hwnd(hwnd)
                                .and_then(|p| get_icon_base64_from_exe(&p))
                                .map(|icon| format!("data:image/png;base64,{}", icon))
                                .unwrap_or_else(|| "".to_string())
                        };

                        // Cache the result
                        let result = (app_name.clone(), icon_data.clone());
                        icon_cache.insert(hwnd, result.clone());
                        result
                    };

                    // Only emit if we have valid data
                    if !app_name.is_empty() {
                        let _ = app.emit(
                            "active_window_changed",
                            serde_json::json!({
                                "name": app_name,
                                "icon": icon_data,
                                "hwnd": hwnd as isize,
                            }),
                        );
                    }
                }
            }
            thread::sleep(Duration::from_millis(50)); // Faster polling
        }
    });
}

#[derive(serde::Serialize)]
pub struct WindowInfo {
    pub hwnd: isize,
    pub title: String,
}
