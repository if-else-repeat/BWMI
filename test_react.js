import jsdom from 'jsdom';
const { JSDOM } = jsdom;
JSDOM.fromURL("http://localhost:3000/prototype/epfo", { runScripts: "dangerously", resources: "usable" }).then(dom => {
  setTimeout(() => {
    console.log(dom.window.document.body.innerHTML);
  }, 3000);
});
