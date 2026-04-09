use reqwest::Client;
use serde_json::Value;
use tauri_plugin_opener::OpenerExt;

#[tauri::command]
pub async fn create_connection(
    app: tauri::AppHandle,
    provider: String,
    email: String,
) -> Result<(), String> {
    let client = Client::new();
    // Security fix: require the Supermemory API key to be provided via environment variable instead of hardcoding it.
    let api_key = std::env::var("SUPERMEMORY_API_KEY")
        .map_err(|_| "Missing SUPERMEMORY_API_KEY environment variable".to_string())?;

    let body = serde_json::json!({
        // No redirectUrl needed since we're opening externally
        "containerTags": [email],
        "documentLimit": 5000
    });

    let body_str = serde_json::to_string(&body).map_err(|e| e.to_string())?;

    let res = client
        .post(&format!(
            "https://api.supermemory.ai/v3/connections/{}",
            provider
        ))
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .body(body_str)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let json: Value = res.json().await.map_err(|e| e.to_string())?;
    let auth_link = json
        .get("authLink")
        .and_then(|v| v.as_str())
        .ok_or("No authLink in response")?;

    // Open the auth link in external browser using opener plugin
    app.opener()
        .open_url(auth_link, None::<&str>)
        .map_err(|e| e.to_string())?;

    Ok(())
}
