import pageRoutes from './router.config';

// ref: https://umijs.org/config/

/**
 * 启用browser router 需配置base字段为nginx服务器中当前项目的前缀名;
 */
const base ='chargingclient';


const config =  {

  define:{
    'process.env.apiUrl':'',// 项目请求地址
    'process.env.wx_appid':'',// 配置微信appid(wingbow)
    'process.env.alipay_appid':''// 配置支付宝appid(wingbow)
  },
  routes:pageRoutes,
  treeShaking: true,
  history: 'browser',  
  publicPath: base ? `/${base}/` : '/',
  base: base ? `/${base}` : '/',
  hash:true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: '',
      dll: false,
      
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],

  disableRedirectHoist: true, // 禁用 redirect 上提
  extraPostCSSPlugins:[
    require('postcss-flexbugs-fixes'),
    require('postcss-px-to-viewport')({
      viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
      // viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
      unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
      selectorBlackList: ['.ignore', '.hairlines',], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: false, // 允许在媒体查询中转换`px`
      // exclude: /(\/|\\)(node_modules)(\/|\\)/ // 过滤掉
      exclude: [/node_modules/], // 过滤掉与第三方组件的UI影响
    }),

  ],
  // proxy: {
  //   '/api/': {
  //     target: 'https://preview.pro.ant.design/api',
  //     changeOrigin: true,
  //     pathRewrite: { '^/api': '' },
  //   },
  // },
}

export default config;
