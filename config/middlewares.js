module.exports = [
  'strapi::errors',
  // 'strapi::cors',
  'strapi::poweredBy',
  {
    name: 'strapi::cors',
    config: {
      "enabled": true,
      origin: "*",
      "expose": [
        "WWW-Authenticate",
        "Server-Authorization"
      ],
      "maxAge": 31536000,
      "credentials": false,
      "methods": [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "HEAD"
      ],
      "headers": [
        "Content-Type",
        "Authorization",
        "X-Frame-Options",
        "Origin"
      ]
    },
  },
  'strapi::logger',
  'strapi::query',
    {
      name: "strapi::body",
      config: {
        formLimit: "256mb", // modify form body
        jsonLimit: "256mb", // modify JSON body
        textLimit: "256mb", // modify text body
        formidable: {
          maxFileSize: 200 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
        },
      },
    },
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:'],
            'img-src': [
              "'self'",
              'data:',
              'blob:',
              'dl.airtable.com',
              'vanlang.s3.ap-southeast-1.amazonaws.com',
              "https://vanlang.s3.ap-southeast-1.amazonaws.com"
            ],
            'media-src': [
              "'self'",
              'data:',
              'blob:',
              'dl.airtable.com',
              'vanlang.s3.ap-southeast-1.amazonaws.com',
              "https://vanlang.s3.ap-southeast-1.amazonaws.com"
            ],
            upgradeInsecureRequests: null,
          },
        },
      },
    },
  'strapi::session',    
  'strapi::favicon',
  'strapi::public',
];
