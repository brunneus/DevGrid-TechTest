const request = require('request');
const GIST_CREATE_URL = 'https://api.github.com/gists';
const { token } = require('../app.config');

const GistService = () => {
    const createNewGist = ({ description, public, fileName, fileContent }) => new Promise((resolve, reject) => {

        const gist = {
            description,
            public,
            files: {
                [fileName]: {
                    "content": fileContent
                }
            }
        }

        const requestOptions = {
            url: GIST_CREATE_URL,
            json: true,
                body: gist,
            headers: {
                "Authorization": `token ${token}`,
                "User-Agent": "DevGridTechTest"
            }
        };

        request.post(requestOptions, (err, response) => {
            const { statusCode } = response;

            if (statusCode === 401) {
                return reject('Bad credentials, please provide a valid token on app.config');
            }

            statusCode === 201
                ? resolve(response)
                : reject(response.body.message);
        });
    })

    const getGistComments = id => new Promise((resolve, reject) => {

        const requestOptions = {
            url: `https://api.github.com/gists/${id}/comments`,
            json: true,
            headers: {
                "User-Agent": "DevGridTechTest"
            }
        };

        request.get(requestOptions, (err, response) => {

            if (err) {
                return reject(err);
            }

            const getCommentInfo = comment => {
                const { login } = comment.user;
                const { body, url } = comment;

                return {
                    content: body,
                    url: url,
                    owner: login
                }
            }

            resolve(response.body.map(getCommentInfo));
        })
    })

    return {
        createNewGist,
        getGistComments
    }
}

module.exports = GistService;