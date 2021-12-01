export type KeyValueType<Key extends string|number|symbol, Value> = {
  [k in Key]?: Value;
};
