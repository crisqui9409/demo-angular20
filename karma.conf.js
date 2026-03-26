module.exports = function (config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],

    client: {
      clearContext: false,
      env: {
        TEST_PSRD: 'testPassword',
        SECOND_TEST_PSRD: 'password123',
        NEW_PSRD: 'new_password',
        SECRET_LOGIN_AVAL: '1234',
      },
    },

    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'lcov' }, { type: 'text-summary' }],
    },

    reporters: ['progress', 'kjhtml', 'coverage'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,

    browsers: ['Chrome'],

    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu'],
      },
    },

    singleRun: false,
    restartOnFileChange: true,

    captureTimeout: 120000,
    browserDisconnectTolerance: 2,
    browserDisconnectTimeout: 120000,
    browserNoActivityTimeout: 120000,
  });
};
