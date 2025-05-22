#
# Building
#
lib/index.js:		src/*.ts Makefile
	rm -f lib/*.js
	npx tsc


#
# Project
#
package-lock.json:	package.json
	npm install
	touch $@
node_modules:		package-lock.json
	npm install
	touch $@
build:			node_modules lib/index.js


#
# Testing
#
test:			test-unit
test-unit:		build
	npx mocha --no-warnings --enable-source-maps tests/unit/*.test.ts


#
# Repository
#
clean-whitespace:
	git ls-files | xargs sed -i 's/[ \t]*$$//'
clean-remove-chaff:
	@find . -name '*~' -exec rm {} \;
clean-files:		clean-remove-chaff
	git clean -nd
clean-files-force:	clean-remove-chaff
	git clean -fd
clean-files-all:	clean-remove-chaff
	git clean -ndx
clean-files-all-force:	clean-remove-chaff
	git clean -fdx


#
# NPM
#
preview-package:	clean-files test
	npm pack --dry-run .
create-package:		clean-files test
	npm pack .
publish-package:	clean-files test
	npm publish --access public .
