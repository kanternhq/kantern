// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod components;

use tauri::Manager;

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
        .invoke_handler(tauri::generate_handler![
            components::pods::get_pods,
            components::pods::get_pod_definition,
            components::pods::delete_pod,
            components::clusters::get_clusters,
            //components::clusters::set_current_cluster,
            components::namespaces::get_namespaces
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
