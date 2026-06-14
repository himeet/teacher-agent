export default defineAppConfig({
  pages: [
    'pages/index/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#F4F6F8',
    navigationBarTitleText: '齿科AI培训平台',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom',
  },
  networkTimeout: {
    request: 180000,
  },
})
