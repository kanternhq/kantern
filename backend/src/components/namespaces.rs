use k8s_openapi::api::core::v1::Namespace;
use kube::{
    api::{Api, ListParams},
    Client,
};

#[tauri::command]
pub async fn get_namespaces() -> Result<Vec<String>, String> {
    let client = Client::try_default().await.map_err(|e| e.to_string())?;
    let namespaces: Api<Namespace> = Api::all(client);

    let lp = ListParams::default();
    let namespace_list = namespaces.list(&lp).await.map_err(|e| e.to_string())?;

    let namespace_names: Vec<String> = namespace_list
        .iter()
        .filter_map(|ns| ns.metadata.name.clone())
        .collect();

    Ok(namespace_names)
}
