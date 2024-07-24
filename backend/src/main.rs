// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use kube::{
    config::{KubeConfigOptions, Kubeconfig},
    Config,
};
use std::fs;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn get_clusters() -> Result<Vec<String>, String> {
    let kubeconfig = Kubeconfig::read().map_err(|e| e.to_string())?;
    Ok(kubeconfig.contexts.into_iter().map(|c| c.name).collect())
}

#[tauri::command]
async fn set_current_cluster(cluster: String) -> Result<(), String> {
    let mut kubeconfig = Kubeconfig::read().map_err(|e| e.to_string())?;
    kubeconfig.set_current_context(&cluster);
    let kube_config_path = Config::default_path().map_err(|e| e.to_string())?;
    fs::write(
        kube_config_path,
        serde_yaml::to_string(&kubeconfig).unwrap(),
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

fn main() {
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
        .invoke_handler(tauri::generate_handler![get_clusters, set_current_cluster])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
