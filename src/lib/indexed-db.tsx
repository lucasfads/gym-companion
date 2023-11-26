import { Workout, Program } from "@/types";

let db: IDBDatabase;
const request = window.indexedDB.open("myDatabase", 1);

request.onerror = function(event) {
  console.log("Erro ao abrir o banco de dados", event);
};

request.onsuccess = function(event) {
  db = (event.target as IDBRequest).result;
};

request.onupgradeneeded = function(event) {
  db = (event.target as IDBRequest).result;
  db.createObjectStore("workouts", { keyPath: "id" });
};


export const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("MyWorkoutsDatabase", 1);

        request.onerror = (event) => {
            console.error("Erro ao abrir o banco de dados IndexedDB", event);
            reject((event.target as IDBRequest).error);
        };

        request.onsuccess = (event) => {
            console.log("Banco de dados IndexedDB aberto com sucesso");
            resolve((event.target as IDBRequest).result);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBRequest).result;

            if (!db.objectStoreNames.contains("workouts")) {
                db.createObjectStore("workouts", { keyPath: "id" });
            }
        };
    });
}

export const addWorkout = (db: IDBDatabase) => {
	const newWorkout = {
		id: Date.now(),
		programs: []
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

export const getWorkout = (id: number) => {
	const transaction = db.transaction(["workouts"]);
	const store = transaction.objectStore("workouts");
	const request = store.get(id);
  
	request.onsuccess = function(event) {
	  console.log("Workout recebido:", (event.target as IDBRequest).result);
	};
  
	request.onerror = function(event) {
	  console.log("Erro ao obter workout do banco de dados", event);
	};
}

export const removeWorkout = (db: IDBDatabase, workoutId : number) => {
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
export const fetchWorkoutDetailsFromDB = async (id: number | string): Promise<Workout> => {
	const db: IDBDatabase = await openDatabase();
	return new Promise((resolve, reject) => {
	  const transaction = db.transaction(["workouts"], "readonly");
	  const store = transaction.objectStore("workouts");
	  const request = store.get(id);
  
	  request.onsuccess = () => resolve(request.result);
	  request.onerror = () => reject(request.error);
	});
}

export const addPrograms = async (workoutId: number, newProgram: Program) => {
    const db: IDBDatabase = await openDatabase();
    const transaction = db.transaction(["workouts"], "readwrite");
    const store = transaction.objectStore("workouts");

    const workoutRequest = store.get(workoutId);

    workoutRequest.onsuccess = () => {
        const workout = workoutRequest.result;
        if (workout) {
            workout.programs.push(newProgram);
            store.put(workout);
        }
    };

    workoutRequest.onerror = (event) => {
        console.log("Erro ao buscar workout", (event.target as IDBRequest).error);
    };
};

export const removeProgram = async (workoutId : number, programId : number) => {
    const db: IDBDatabase = await openDatabase();
    const transaction = db.transaction(["workouts"], "readwrite");
    const store = transaction.objectStore("workouts");

    const workoutRequest = store.get(workoutId);

    workoutRequest.onsuccess = () => {
        const workout = workoutRequest.result;
        if (workout) {
            const updatedPrograms = workout.programs.filter((program: Program) => program.id !== programId);
            workout.programs = updatedPrograms;
            store.put(workout);
        }
    };

    workoutRequest.onerror = (event) => {
        console.log("Erro ao buscar workout", (event.target as IDBRequest).error);
    };
};

export const updateProgramInDB = async (workoutId : number, updatedProgram : Program) => {
  const db: IDBDatabase = await openDatabase();
  const transaction = db.transaction(["workouts"], "readwrite");
  const store = transaction.objectStore("workouts");

  const workoutRequest = store.get(workoutId);

  workoutRequest.onsuccess = () => {
      const workout = workoutRequest.result;
      if (workout) {
          const programIndex = workout.programs.findIndex((program: Program) => program.id === updatedProgram.id);
          if (programIndex !== -1) {
              workout.programs[programIndex] = updatedProgram;
          }
          store.put(workout);
      }
  };

  workoutRequest.onerror = (event) => {
      console.log("Erro ao buscar workout", (event.target as IDBRequest).error);
  };

  transaction.oncomplete = () => {
      console.log("Programa atualizado com sucesso no IndexedDB.");
  };

  transaction.onerror = (event) => {
      console.log("Erro ao atualizar programa no IndexedDB", (event.target as IDBRequest).error);
  };
};

