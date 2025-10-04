export interface User {
  userid: number;
  useruuid: string;
  clerkuserid: string;
  email: string;
  firstname: string;
  lastname: string;
  isactive: boolean;
  createdby?: number;
  createdon: Date;
  updatedby?: number;
  updatedon: Date;
}

export interface Role {
  roleid: number;
  roleuuid: string;
  rolename: string;
  roledescription?: string;
  isactive: boolean;
  createdby?: number;
  createdon: Date;
  updatedby?: number;
  updatedon: Date;
}

export interface UserRole {
  userroleid: number;
  userroleuuid: string;
  userid: number;
  roleid: number;
  assignedon: Date;
  assignedby?: number;
  isactive: boolean;
}

export interface Category {
  categoryid: number;
  categoryuuid: string;
  categoryname: string;
  categorydescription?: string;
  isactive: boolean;
  createdby?: number;
  createdon: Date;
  updatedby?: number;
  updatedon: Date;
}

export interface Item {
  itemid: number;
  itemuuid: string;
  itemname: string;
  itemdescription?: string;
  categoryid?: number;
  sku?: string;
  unit: string;
  quantity: number;
  reorderthreshold: number;
  costprice: number;
  supplierinfo?: string;
  storagelocation?: string;
  expirydate?: Date;
  isactive: boolean;
  createdby?: number;
  createdon: Date;
  updatedby?: number;
  updatedon: Date;
}

export interface LowStockItem {
  itemid: number;
  itemuuid: string;
  itemname: string;
  sku?: string;
  quantity: number;
  reorderthreshold: number;
  unit: string;
  categoryname: string;
  costprice: number;
  stockdifference: number;
}

export interface InventoryValue {
  categoryname: string;
  itemcount: number;
  totalvalue: number;
  avgcostprice: number;
}

export interface UserActivity {
  userid: number;
  username: string;
  email: string;
  rolename: string;
  totalactions: number;
  itemsadded: number;
  itemsupdated: number;
  itemsdeleted: number;
  lastactivity?: Date;
}

export interface ItemLog {
  logid: number;
  action: string;
  oldvalues: Record<string, unknown> | null;
  newvalues: Record<string, unknown> | null;
  quantitychanged: number | null;
  reasoncode: string | null;
  notes: string | null;
  changedon: Date;
  changedby: number | null;
  changedbyname: string | null;
}
