import * as fs from 'fs';

/**
 * DB fs adapter with synchronous loading
 */
export default class DbFsAdapter {
    /**
     * Checks if a database file exists
     * @param {string} dbname
     * @return {boolean}
     */
    protected isDbFileExist(dbname: string): boolean {
        try {
            const stat = fs.statSync(dbname);

            if (!stat.isFile()) {
                return false;
            }
        } catch (err) {
            return false;
        }

        return true;
    }

    /**
     * Load data from file, will throw an error if the file does not exist
     * @param {string} dbname - the filename of the database to load
     * @param {function} callback - the callback to handle the result
     */
    public loadDatabase(dbname: string, callback: any): void {
        if (this.isDbFileExist(dbname)) {
            try {
                callback(fs.readFileSync(dbname, {encoding: 'utf8'}));
            } catch (err) {
                callback(new Error(err));
            }
        } else {
            callback(null);
        }
    }

    /**
     * Save data to file, will throw an error if the file can't be saved
     * might want to expand this to avoid dataloss on partial save
     * @param {string} dbname - the filename of the database to load
     * @param {string} dbstring - database data
     * @param {function} callback - the callback to handle the result
     */
    public saveDatabase(dbname: string, dbstring: string, callback: any): void {
        const tmpdbname = dbname + '~';
        fs.writeFile(tmpdbname, dbstring, (err: Error) => {
            if (err) {
                callback(err);
            } else {
                fs.rename(tmpdbname, dbname, callback);
            }
        });
    }

    /**
     * Delete the database file, will throw an error if the
     * file can't be deleted
     * @param {string} dbname - the filename of the database to delete
     * @param {function} callback - the callback to handle the result
     */
    public deleteDatabase(dbname: string, callback: any): void {
        fs.unlink(dbname, (err: Error) => {
            if (err) {
                callback(err);
            } else {
                callback();
            }
        });
    }
}
