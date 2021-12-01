/**
 * Generic storage service wrapping the web Storage interface
 */
export abstract class StorageAbstract<K> {

  /**
   * Constructor
   */
  constructor(
    private storage: Storage,
  ) {

  }

  /**
   * Sets key/value pair with optional salt
   */
  setItem(key: K, value: string, salt: string = ''): void {

    this.storage.setItem(
      this.getKey(key, salt),
      value,
    );
  }

  /**
   * Return the value identified by key
   */
  getItem(key: K, salt: string = ''): string|null {

    return this.storage.getItem(
      this.getKey(key, salt),
    );
  }

  /**
   * Remove value identified by key
   */
  removeItem(key: K, salt: string = ''): void {

    this.storage.removeItem(
      this.getKey(key, salt),
    );
  }

  /**
   * Clear storage
   */
  clear(): void {

    this.storage.clear();
  }

  /**
   * Return key with optional salt
   */
  protected getKey(key: K, salt: string = ''): string {

    return salt ? [String(key), salt].join(':') : String(key);
  }
}
