
/**
 * This function intends to work as jest.mock() but fixes issues with llocal modules sharing the same name but a
 * different path. See https://github.com/facebook/jest/issues/2070
 *
 * Make sure that doMock() is called BEFORE the import and require as the calls are not hoisted like jest.mock()!
 *
 * It's used exactly as jest.mock() and will ensure the right mock is loaded without conflicts. You can provide a
 * factory function so you don't have to worry when to use jest.mock() or doMock().
 *
 * This is a basic implementation that only works in these scenarios
 *  - node_modules: including a module available in `node_module` by referencing its name. E.g. require('lodash') will
 *    try to load the mock file `<rootDir>/_mocks_/lodash.js. If referencing a module internal file, it will try to
 *    load the relevant mock file. E.g. require('lodash/flatten') -> `<rootDit>/_mocks_/lodash/flatten.js`. This
 *    behavior is not currently customizable. Node modules are detected by the presence of `node_module` in the resolved
 *    path and are considered to be within the project node_modules directory directly.
 *  - Project files: the loader locate a mock file in the same directory as the required file. E.g.
 *    require('app/module/something') -> `<rootDir>/app/module/_mocks_/something.js`
 *
 * Extensions are preserved.
 *
 * @param {String} moduleName
 * @param {Function} [factory]
 */
function doMock(moduleName, factory = null) {
  if (factory) {
    jest.doMock(moduleName, factory);

    return;
  }

  const path = require('path');
  const fs = require('fs');
  const resolvedPath = require.resolve(moduleName);

  const directory = path.dirname(resolvedPath);
  const filename = path.basename(resolvedPath);
  let mockfile = '';

  if (directory.includes('/node_modules/')) {
    mockfile = path.join(directory.substr(0, directory.indexOf('/node_modules/')), '_mocks_', moduleName);

    // append ".js" extension if none is available
    if (!path.extname(mockfile)) {
      mockfile += '.js';
    }
  } else {
    mockfile = path.join(directory, '_mocks_', filename);
  }

  if (!fs.existsSync(mockfile)) {
    throw new Error(`Impossible to find a mockfile for "${moduleName}". Tried: ${mockfile}`);
  }

  jest.doMock(moduleName, () => require.requireActual(mockfile));
}

module.exports = {
  doMock,
};
