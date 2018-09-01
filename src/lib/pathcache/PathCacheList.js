const PathCacheItem = require('./PathCacheItem');

/**
 * A list of cached paths for a single directory.
 * @param {PathCacheItem[]} [items] - An optional array of PathCacheItem items.
 */
class PathCacheList {
	constructor(items) {
		this.indices = {};
		this.list = [];

		if (items) {
			this.push(items);
		}
	}

	/**
	 * Push items into the cache list.
	 * @param {...PathCacheItem[]} - A list of arguments defining items to insert.
	 */
	push() {
		[...arguments].forEach((arg) => {
			if (!Array.isArray(arg)) {
				arg = [arg];
			}

			arg.forEach((item) => {
				let index;

				if (!(item instanceof PathCacheItem)) {
					throw new Error('item must be an instance of PathCacheItem.');
				}

				if ((index = this.indices[item.pathName]) === undefined) {
					// File does not exist in the source/dir index cache
					this.indices[item.pathName] = (
						this.list.push(item)
					) - 1;
				} else {
					this.list[index] = item;
				}
			});
		});
	}

	/**
	 * Returns the index of a path within the list.
	 * @param {number} source - One of {@link PathCache.sources} sources.
	 * @param {string} file - Fully qualified path (including directory).
	 * @returns {number} The index of the item, or `-1` if the item cannot be
	 * found.
	 */
	indexOf(pathName) {
		return (pathName in this.indices) ? this.indices[pathName] : -1;
	}

	/**
	 * Retrieves a PathCacheItem from the cache by its full path name.
	 * @param {string} pathName - The path name of the file.
	 * @returns {PathCacheItem|null} Either the PathCacheItem representing the
	 * file, or `null` if no file was found.
	 */
	getByPath(pathName) {
		if (this.indexOf(pathName) !== -1) {
			return this.list[
				this.indices[pathName]
			];
		}

		return null;
	}

}

module.exports = PathCacheList;
