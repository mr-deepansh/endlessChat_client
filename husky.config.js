module.exports = {
  hooks: {
    'pre-commit': 'npm run precommit',
    'pre-push': 'npm run prepush',
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
  },
};
