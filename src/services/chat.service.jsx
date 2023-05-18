import {initializeApp} from "firebase/app";
import {child, getDatabase, onValue, orderByChild, push, query, ref, remove, set, serverTimestamp} from "firebase/database";

const CONFIG = {
  databaseURL: "https://acessibilidade-dev-chat-default-rtdb.firebaseio.com",
};

const app = initializeApp(CONFIG);


let subscriptions = {};

export const getDb = () => {
  return getDatabase(app);
}

export const TIMESTAMP = serverTimestamp;

const db = getDb();

export async function writeData(payload) {
  const {path, data} = payload; 
  
  // pegar uma chave para o novo usuário
  let refId = push(child(ref(db), path)).key;

  try {
    await set(ref(db, path + "/" +refId), data);
    return {
      success: true,
      refId
    };
  } catch (e) {
    console.error(e.message);
    return {
      success: false,
      error: e.message
    };
  }
}

export function subscription(path, callback, opts = {onlyOnce : false}) {
  const unsubCallback = onValue(query(ref(db, path), orderByChild("createdAt")), (snapshot) => {
    let vet = [];
    snapshot.forEach((childSnapshot) => {
      const key = childSnapshot.key;
      const value = childSnapshot.val();
      vet.push({key, ...value})
    })
    callback(vet);
  }, opts);
  subscriptions[path] = unsubCallback;
}

export function unsubscription(path) {
  subscriptions[path]()
}

export async function removeData(path){
  try {
    await remove(ref(db, path));
    return {
      success: true,
      path
    };
  } catch (e) {
    console.error(e.message);
    return {
      success: false,
      error: e.message
    };
  }

}