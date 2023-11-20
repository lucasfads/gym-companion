let db;
const request = window.indexedDB.open("myDatabase", 1);

request.onerror = function(event) {
  console.log("Erro ao abrir o banco de dados", event);
};

request.onsuccess = function(event) {
  db = event.target.result;
};

request.onupgradeneeded = function(event) {
  db = event.target.result;
  db.createObjectStore("workouts", { keyPath: "id" });
};


export const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("MyWorkoutsDatabase", 1);

        request.onerror = (event) => {
            console.error("Erro ao abrir o banco de dados IndexedDB", event);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            console.log("Banco de dados IndexedDB aberto com sucesso");
            resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains("workouts")) {
                db.createObjectStore("workouts", { keyPath: "id" });
            }
        };
    });
}

export const addWorkout = (db) => {
	const newWorkout = {
		id: Date.now(),
	};
	
	const transaction = db.transaction(["workouts"], "readwrite");
	const store = transaction.objectStore("workouts");
	const request = store.add(newWorkout);
  
	request.onsuccess = function() {
	  console.log("Workout adicionado ao banco de dados");
	};
  
	request.onerror = function(event) {
	  console.log("Erro ao adicionar workout ao banco de dados", event);
	};
}

export const getWorkout = (id) => {
	const transaction = db.transaction(["workouts"]);
	const store = transaction.objectStore("workouts");
	const request = store.get(id);
  
	request.onsuccess = function(event) {
	  console.log("Workout recebido:", event.target.result);
	};
  
	request.onerror = function(event) {
	  console.log("Erro ao obter workout do banco de dados", event);
	};
}

export const removeWorkout = (db, workoutId) => {
	const transaction = db.transaction(["workouts"], "readwrite");
	const store = transaction.objectStore("workouts");
	
  const request = store.delete(workoutId);
  
	request.onsuccess = function() {
	  console.log("Workout removido ao banco de dados");
	};
  
	request.onerror = function(event) {
	  console.log("Erro ao remover workout ao banco de dados", event);
	};
}