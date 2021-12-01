export interface AgentProductionTableResponseInterface extends Array<{
  data: Array<{
    name: string;
    val: number;
  }>;
  name: string;
  prefix?: string;
  type?: string;
}> {

}
