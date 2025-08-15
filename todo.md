
- [x] Better changelog

- [x] Clean docs and remove old files from old tentatives (like bundling with python)

- [ ] Clean the `/tests`  (templates / views)
    - [x] Find a way to do a two bird with one stone with `/scenery` (but careful, it requires a server for Flask)
    - [ ] do it the other way around; scenery has its own python environment and therefore can be safely eecetued after isntall any where (and it's not a dependency of nagini)

- [x] CDN Import Solutions
    - [x] Created UMD bundle (`nagini.umd.js`) for universal compatibility
    - [x] Documented esm.sh CDN solution for automatic ES6 import resolution
    - [x] Added import maps solution for modern browsers
    - [ ] Add UMD test to scenery test suite 

    - [ ] git tag hook to ensure all tests in scenery made it

- [x] Implement brython in `src/brython/`
    - [x] Ensure Turtle is working
    - [x] write a test and maybe keep the draft statically in an /experiments folder ? 



- [ ] do hooks  better 
    - [] one for tag: selenium/scenery based (is prepush ? or maybe on main and authorize tags only from main ?)
    - [] one for commits (size of files mostly + static js typing in a python doctest like would be the dream)
    - [ ] critics json to wrapp in git tagging process + visible from scenery/index.html 


- [] Add Licence buy button

- [] Update hooks for ensuring checking of ALL files at every commit

- [] decide about how to use scenery (externally - no install here) 
    - [] check the outputs in the table in `/scenery/index.html`


- [ ] Put `/tests` with flask app in `/scenery`


- [ ] Make this amount of logging optional / define levels (but keep it - it so useful)

# Low

- [ ] Analyse very precisely by generated the meta code from `/pyodide/py` to understand what's loaded / what wrappers are used etc.... 
    - [ ] Make some stuff optional to try to build the lightest fastest 
    - [ ] See if you can have one or two with dedicated set of option (full / nothing except missive ? maybe)





- [] Consider adding support for `input()` with Brython Manager
