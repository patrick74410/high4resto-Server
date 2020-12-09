export class Util {
    public trackById(index: number, item: any) {
        return item ? item.id : null;
    }
    public trackByTableName(index: number, item: any) {
        return item ? item.tableName : null;
    }

}