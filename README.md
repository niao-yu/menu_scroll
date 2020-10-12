## 本项目使用「极速零配置Web应用打包工具——```parceljs```」进行编译。 ##

## parceljs官网地址：[https://zh.parceljs.org/](https://zh.parceljs.org/) ##

本框架基于createapp网站生成的项目修改，这个网站可以定制化生成webpack和parceljs的构建配置，```createapp```网站官网：[https://createapp.dev/](https://createapp.dev/)

---

## 要点说明：

- src为项目文件夹，dist为开发和打包后会更新的文件夹，需要注意的是，里面的html、css、js、图片等文件全都会平铺展示。  
- pubilc文件夹，可以放置一些不需要编译、保留目录结构的文件，待打包完成后，此文件夹内的文件，会复制到dist文件夹内。  
- html文件中，需要自己引用js(可以使用es6语法)和css(可以是scss类型)文件。  
- 开发时，启动服务后，默认访问路径为：```localhost:1234```，但由于是多html文件项目，必须使用```localhost:1234/index.html```才能打开，这里我是启动服务后，不使用```parceljs```提供的```localhost:1234```访问项目，而是进入到dist文件夹，使用vs code的插件启动服务查看，目的就是为了优化前面那个问题。  

## 命令说明：

截止当前，我的命令为一下两条：

```json
  "dev": "rm -rf ./.cache && rm -rf ./dist && parcel ./src/*.html",
  "build": "rm -rf ./.cache ./dist ./build && parcel build ./src/*.html -d build --public-url ./ --no-source-maps --no-minify"
```

下面说明一下参数：

- ```rm -rf ./.cache```：删除缓存文件夹  
- ```rm -rf ./dist```：删除上次构建好的项目文件夹  
- ```parcel ./src/*.html```：启动服务，入口文件为```./src```下的html文件  
- ```-d build```：生成的项目文件夹修改，开发时可以使用默认的dist文件夹，而build构建时添加这个参数，这样构建完后的代码就放在build文件夹中。  
- ```parcel build ./src/*.html```：构建项目，入口文件为```./src```下的html文件  
- ```--public-url ./```：指定项目中引用文件的路径，由默认的绝对路径```/```，改为相对路径```./```  
- ```--no-source-maps```：不生成```.map```文件  
- ```--no-minify```：禁用代码压缩混淆  
