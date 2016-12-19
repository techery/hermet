#!/usr/bin/env groovy

String MAIN_NODE = 'api'
def utils = fileLoader.fromGit('jenkins-android-pipeline-utils.groovy', 'https://gist.github.com/3d72ba81965db879ceb38e4bef991b6a.git', 'cfead7642677b4ae8c4dfb134f73d62c8124e4e7', null, 'master');

utils.runBuild(MAIN_NODE) {
  stage('checkout') {
    checkout([
      $class: 'GitSCM',
      branches: scm.branches,
      userRemoteConfigs: scm.userRemoteConfigs,
      submoduleCfg: [],
      doGenerateSubmoduleConfigurations: false,
      extensions: [
        [$class: 'CleanBeforeCheckout'],
        [
          $class: 'CloneOption',
          shallow: true,
          depth: 10,
          noTags: true,
          timeout: 30
        ]
      ]
    ])
    stash name: 'sources'
  }

  stage('install packages') {
    sh "rm -rf ${WORKSPACE}/node_modules"
    sh 'npm install'
  }

  stage('Run linting utility') {
    sh "./node_modules/.bin/gulp lint"
  }
}
