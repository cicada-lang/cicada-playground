module.exports = {
  // https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-plugin
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "蟬語學習室 / Cicada Studyroom"
      return args
    })
  },
  pwa: {
    themeColor: "#ffffff",
    msTileColor: "#ffffff",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "white",
  },
}
