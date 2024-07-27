// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use kube::config::Kubeconfig;
use tauri::Manager;

#[tauri::command]
async fn get_clusters() -> Result<Vec<String>, String> {
    println!("get_clusters function called");
    let kubeconfig = Kubeconfig::read().map_err(|e| e.to_string())?;
    let clusters: Vec<String> = kubeconfig.contexts.into_iter().map(|c| c.name).collect();

    // Log the clusters being sent to the frontend
    println!("Sending clusters to frontend: {:?}", clusters);

    Ok(clusters)
}

fn main() {
    println!("Starting Tauri application");
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_clusters])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
