export const componentsData = [
  {
    type: 'Template',
    label: 'table',
    component: 'app-table-comp',
    styles: { zoom: '0.3 ' },
  },

  {
    type: 'Button',
    label: 'button',
    component: 'button',
    styles: {
      width: '100px',
      height: '30px',
      backgroundColor: '#183149',
      borderRadius: '8px',
      border: '0px',
      color: '#FFF',
    },
  },

  {
    type: 'Shape',
    label: 'circle',
    component: 'div',
    styles: {
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      backgroundColor: 'rgb(146, 146, 146)',
    },
  },
  {
    type: 'Shape',
    label: 'rectangle',
    component: 'div',
    styles: {
      width: '100px',
      height: '50px',
      backgroundColor: 'rgb(146, 146, 146)',
    },
  },
  {
    type: 'Shape',
    label: 'rounded rectangle',
    component: 'div',
    styles: {
      width: '100px',
      height: '50px',
      borderRadius: '15px',
      backgroundColor: 'rgb(146, 146, 146)',
    },
  },
  {
    type: 'Shape',
    label: 'horizontal line',
    component: 'div',
    styles: {
      width: '100px',
      height: '2px',
      backgroundColor: 'rgb(146, 146, 146)',
    },
  },
  {
    type: 'Shape',
    label: 'vertical line',
    component: 'div',
    styles: {
      width: '2px',
      height: '50px',
      backgroundColor: 'rgb(146, 146, 146)',
    },
  },

  {
    type: 'Text',
    label: 'text',
    component: 'p',
    styles: {
      fontSize: '20px',
      color: 'rgb(146, 146, 146)',
      textAlign: 'left',
      fontFamily: 'Roboto',
      fontWeight: 'normal',
      fontStyle: 'normal',
    },
  },

  {
    type: 'Image',
    label: 'image',
    component: 'img',
    styles: { width: '250px', height: '50px' },
    src: 'assets/safran.png',
  },
  {
    type: 'Image',
    label: 'circle image',
    component: 'img',
    styles: { width: '35px', height: '35px' },
    src: 'assets/image2.jpg',
  },

  {
    type: 'Icon',
    label: 'Home',
    component: 'i',
    styles: { fontSize: '24px', color: 'rgb(146, 146, 146)' },
    icon: 'mdi:home',
  },
  {
    type: 'Icon',
    label: 'Menu',
    component: 'i',
    styles: { fontSize: '24px', color: 'rgb(146, 146, 146)' },
    icon: 'mdi:menu',
  },
  {
    type: 'Icon',
    label: 'Phone',
    component: 'i',
    styles: { fontSize: '24px', color: 'rgb(146, 146, 146)' },
    icon: 'mdi:phone',
  },
  {
    type: 'Icon',
    label: 'Time',
    component: 'i',
    styles: { fontSize: '24px', color: 'rgb(146, 146, 146)' },
    icon: 'mdi:access-time',
  },
  {
    type: 'Icon',
    label: 'Sms',
    component: 'i',
    styles: { fontSize: '24px', color: 'rgb(146, 146, 146)' },
    icon: 'mdi:sms',
  },

  {
    type: 'Form',
    label: 'Input Field',
    component: 'input-text',
    styles: {
      width: '100px',
      height: '30px',
      padding: '8px',
      borderRadius: '8px',
      cursor: 'default',
    },
  },
  {
    type: 'Form',
    label: 'Input Stepper',
    component: 'input-stepper',
    styles: {
      width: '100px',
      height: '30px',
      padding: '8px',
      borderRadius: '8px',
      cursor: 'default',
    },
    attributes: { type: 'number', min: '0', max: '10', step: '1' },
  },
  {
    type: 'Form',
    label: 'Checkbox',
    component: 'input-checkbox',
    styles: { width: '15px', height: '15px' },
    attributes: { type: 'checkbox' },
  },
  {
    type: 'Form',
    label: 'Radio Button',
    component: 'input-radio',
    styles: { width: '15px', height: '15px' },
    attributes: { type: 'radio', name: 'radio-group' },
  },
  {
    type: 'Form',
    label: 'Slider',
    component: 'input-slider',
    styles: { width: '50px', height: '15px' },
    attributes: { type: 'range', min: '0', max: '100', step: '1' },
  },

  // Navbar Template
  {
    type: 'Template',
    label: 'Navbar',
    component: 'nav',
    styles: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '10px 20px',
      margin: '0',
      fontFamily: 'Arial, sans-serif',
      width: '752px',
      height: '32px',
    },
    content: [
      {
        component: 'div',
        styles: { fontWeight: 'bold', fontSize: '1.2em' },
        content: 'SAFRAN',
      },
      {
        component: 'ul',
        styles: {
          display: 'flex',
          listStyle: 'none',
          margin: '0',
          padding: '0',
        },
        content: [
          {
            component: 'li',
            styles: { marginLeft: '20px' },
            content: [
              {
                component: 'a',
                styles: { color: 'white', textDecoration: 'none' },
                content: 'Services',
                attributes: { href: '#' },
              },
            ],
          },
          {
            component: 'li',
            styles: { marginLeft: '20px' },
            content: [
              {
                component: 'a',
                styles: { color: 'white', textDecoration: 'none' },
                content: 'Projects',
                attributes: { href: '#' },
              },
            ],
          },
          {
            component: 'li',
            styles: { marginLeft: '20px' },
            content: [
              {
                component: 'a',
                styles: { color: 'white', textDecoration: 'none' },
                content: 'Profile',
                attributes: { href: '#' },
              },
            ],
          },
        ],
      },
    ],
  },

  // Sidebar Template
  {
    type: 'Template',
    label: 'Sidebar',
    component: 'aside', // Utilisation de la balise <aside>
    styles: {
      width: '104px',
      height: '352px',
      backgroundColor: '#183149',
      color: 'white',
      padding: '20px',
    },
    content: [
      {
        component: 'ul',
        styles: { listStyle: 'none', margin: '0', padding: '0' },
        content: [
          {
            component: 'li',
            styles: { marginBottom: '10px' },
            content: [
              {
                component: 'a',
                styles: { color: 'white', textDecoration: 'none' },
                content: 'Home',
                //attributes: { href: '' }
              },
            ],
          },
          {
            component: 'li',
            styles: { marginBottom: '10px' },
            content: [
              {
                component: 'a',
                styles: { color: 'white', textDecoration: 'none' },
                content: 'Dashboard',
              },
            ],
          },

          {
            component: 'li',
            styles: { marginBottom: '10px' },
            content: [
              {
                component: 'a',
                styles: { color: 'white', textDecoration: 'none' },
                content: 'Settings',
              },
            ],
          },
        ],
      },
    ],
  },

  // Footer Template
  {
    type: 'Template',
    label: 'Footer',
    component: 'footer',
    styles: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#2c3e50',
      color: 'white',

      fontFamily: 'Arial, sans-serif',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      width: '752px',
      height: '23px',
    },
    content: [
      {
        component: 'div',
        styles: { fontSize: '0.9em', textAlign: 'center' },
        content: '© 2025 Safran. Tous droits réservés.',
      },
    ],
  },
];
