export function StorageMock(): Storage {

  let store = {};
  const mock = jasmine.createSpyObj('Storage', ['length', 'getItem', 'setItem', 'removeItem', 'key', 'clear']);

  const storage = {
      get length (): number {

        return Object.keys(store).length;
      },
      getItem: (key: string): string => {

        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {

        store[key] = value;
      },
      removeItem: (key) => {

        delete store[key];
      },
      key: (i) => {

        const keys = Object.keys(store);

        return keys[i] || null;
      },
      clear: () => {

        store = {};
      },
  };

  mock.getItem.and.callFake(storage.getItem);
  mock.setItem.and.callFake(storage.setItem);
  mock.removeItem.and.callFake(storage.removeItem);
  mock.key.and.callFake(storage.key);
  mock.clear.and.callFake(storage.clear);

  return mock;
}
