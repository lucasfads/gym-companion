export const openDatabase = () => {
    return new Promise((resolve, reject) => {
        // Nome e versão do banco de dados IndexedDB
        const request = window.indexedDB.open("MyWorkoutsDatabase", 1);

        request.onerror = (event) => {
            console.error("Erro ao abrir o banco de dados IndexedDB", event);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            console.log("Banco de dados IndexedDB aberto com sucesso");
            resolve(event.target.result);
        };

        // Este evento é executado apenas quando há uma necessidade de criar o banco de dados
        // ou quando precisa ser atualizado (ex.: mudança de versão).
        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Cria uma object store chamada 'workouts' com 'id' como chave primária
            if (!db.objectStoreNames.contains("workouts")) {
                db.createObjectStore("workouts", { keyPath: "id" });
            }
        };
    });
}
