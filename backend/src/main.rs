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
            components::pods::get_pod_yaml,
            components::pods::apply_pod_yaml,
            components::pods::get_pod_definition,
            components::pods::delete_pod,
            components::deployments::get_deployments,
            components::deployments::get_deployment_yaml,
            components::statefulsets::get_stateful_sets,
            components::statefulsets::get_stateful_set_yaml,
            components::statefulsets::delete_stateful_set,
            components::daemonsets::get_daemon_sets,
            components::daemonsets::get_daemon_set_yaml,
            components::daemonsets::delete_daemon_set,
            components::services::get_services,
            components::services::get_service_yaml,
            components::services::delete_service,
            components::clusters::get_clusters,
            //components::clusters::set_current_cluster,
            components::namespaces::get_namespaces
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
