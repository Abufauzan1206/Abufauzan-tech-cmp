export function saveDraft(key, data) {

  localStorage.setItem(

    key,

    JSON.stringify(data)

  );

}

export function loadDraft(key) {

  const draft = localStorage.getItem(key);

  if (!draft) {

    return null;

  }

  return JSON.parse(draft);

}

export function clearDraft(key) {

  localStorage.removeItem(key);

}