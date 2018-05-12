const vscode = require('../mocks/node/vscode');

module.exports = {
	mockUriFile: vscode.Uri.file(__dirname + '/transfer/test-file.txt'),
	mockUriFile2: vscode.Uri.file(__dirname + '/transfer/test-file-2.txt'),
	mockUriFolder: vscode.Uri.file(__dirname + '/transfer/test-folder/'),

	servers: {
		SFTP: {
			file: '/fake/path/to/.push.settings.json',
			fileContents: '[none]',
			newFile: true,
			data: {
				service: 'SFTP',
				SFTP: {
					host: 'neilinscotland.net',
					username: 'neil',
					root: '/home/neil/push-test/standard'
				}
			},
			hash: '8b53a44c35c78bee907be597be901e60c658b547a3b59e63f52d964ae70f058e'
		}
	}
};