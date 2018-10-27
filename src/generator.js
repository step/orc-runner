#! /usr/bin/env node
const Scaffold = require('scaffold-generator');
const mustache = require('mustache');
const shell = require('shelljs');

function cloneRepo() {
  shell.exec('git clone https://github.com/step/orc-runner.git');
}

function fillTemplateAndCopy(orcName) {
  mustache.escape = v => v;
  return new Scaffold({
    data: {
      orcName: orcName
    },
    render: mustache.render
  }).copy(
    `${process.cwd()}/orc-runner/orc-scaffold`,
    `${process.cwd()}/${orcName}`
  );
}

function removeClonedRepo() {
  shell.rm('-rf', `${process.cwd()}/orc-runner`);
}

function generateScaffold(orcName) {
  cloneRepo();
  fillTemplateAndCopy(orcName).then(function() {
    removeClonedRepo();
    console.log('Done...');
  });
}

const orcName = process.argv[2];
generateScaffold(orcName);
