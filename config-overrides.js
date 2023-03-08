/* config-overrides.js */
const path = require("path");
const paths = require("react-scripts/config/paths");
const { REACT_APP_ENV } = process.env;
//  env 是 process.env.NODE_ENV  react-app-rewired build 时  env==='production'

let cdnPublicPath = "";

if (REACT_APP_ENV === "prod") {
  cdnPublicPath = `//static.cnccbm.org.cn/teacher-training/${REACT_APP_ENV}`;
} else {
  cdnPublicPath = `//static.dragonest.com/teacher-training/${REACT_APP_ENV}`;
}

console.log("get", cdnPublicPath);
process.env.GENERATE_SOURCEMAP = "false";
module.exports = function override(config, env) {
  // 非打包环境下
  const oneOf_loc = config.module.rules.findIndex(n => n.oneOf)
  config.module.rules[oneOf_loc].oneOf = [
    //例如要增加处理less的配置
    {
      test: /\.less$/,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
          },
        },
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
              // modifyVars: getThemeVariables({
              //   dark: false, // 开启暗黑模式
              //   compact: false, // 开启紧凑模式
              // }),
              javascriptEnabled: true,
            },
          },
        },
      ],
    },
    ...config.module.rules[oneOf_loc].oneOf,
  ]

  if (config.mode !== "production") {
    return config;
  }
  config.devtool =
    config.mode === "development" ? "cheap-module-source-map" : false;
  // 修改path目录
  // paths.appBuild = path.join(path.dirname(paths.appBuild), "dist");
  // config.output.path = path.join(path.dirname(config.output.path), "dist");
  config.output.publicPath = cdnPublicPath;
  return config;
};
