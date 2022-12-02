import favicon from "./extensions/favicon_logo.png";

const config = {
  };
  const bootstrap = app => {
    console.log(app);
    document.title = "BESTIE ADMIN"
  };
  
  export default {
    config: {
      head: {
        favicon: favicon,
      },
      auth:{
        logo: favicon
      },
      menu:{
        logo: favicon
      },
      translations: {
        en: {
          "Auth.form.welcome.title": "Welcome to BESTIE!",
          "Auth.form.welcome.subtitle": "Log in to BESTIE Account",
          'app.components.LeftMenu.navbrand.title': 'BESTIE Dashboard',
        },
      }
    },  
    bootstrap,
  };
  