var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'main',
        repo: 'https://github.com/whakati/datocms-plugin-hostaway-listing', // Update to point to your repository  
        user: {
            name: 'Maximilian Gustafsson', // update to use your name
            email: 'gusx@pm.me' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)