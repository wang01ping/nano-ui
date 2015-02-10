module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %>\n' +
            ' * <%= pkg.author %>(<%= pkg.email %>) \n' +
            ' * <%= grunt.template.today("yyyy") %> copyright bendibao.com\n' +
            ' */\n',

        /*合并文件*/
        concat: {
            options: {
                // 定义一个用于插入合并输出文件之间的字符
                separator: ';'
            },
            dist: {
                // 将要被合并的文件
                src: ['js/src/**/*.js'],
                // 合并后的JS文件的存放位置
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        },

        /*混淆压缩*/
        uglify: {
            options: {
                // 此处定义的banner注释将插入到输出文件的顶部
                banner: '<%= banner %>'
            },
            dist: {
                files: {
                    'dist/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        /*js语法检测*/
        jshint: {
            all: ['Gruntfile.js', 'js/src/**/*.js']
        },

        /*复制文件*/
        copy: {
            main: {
                expand: true,
                cwd: 'dist/',
                src: '**',
                dest: 'examples/',
                flatten: false  //配置为true则将目录数中的文件全并列拷贝到同一个层级
            },
        },

        /*LESS编译*/
        less: {
            options: {
                banner: '<%= banner %>',
            },
            production: {
                files: {
                    "dist/css/<%= pkg.name %>.css": "less/<%= pkg.name %>.less"
                }
            }
        },

        autoprefixer: {
            options: {
                banner: '<%= banner %>',
                browsers: [
                    'Android 2.3',
                    'Android >= 4',
                    'Chrome >= 20',
                    'Firefox >= 15', // Firefox 24 is the latest ESR
                    'Explorer >= 6',
                    'iOS >= 6',
                    'Opera >= 12',
                    'Safari >= 6'
                ]
            },
            production: {
                src: 'dist/css/*.css'
            }
        },

        /*CSS压缩*/
        cssmin: {
            options: {
                banner: '<%= banner %>',
                keepSpecialComments: '0',
                beautify: {
                    //中文ascii化，非常有用！防止中文乱码的神配置
                    ascii_only: true
                }
            },
            production: {
                expand: true,        // 启用下面的选项
                cwd: 'dist/css/',    // 指定待压缩的文件路径
                src: ['*.css', '!*.min.css'],    // 匹配相对于cwd目录下的所有css文件(排除.min.css文件)
                dest: 'dist/css/',    // 生成的压缩文件存放的路径
                ext: '.min.css'        // 生成的文件都使用.min.css替换原有扩展名，生成文件存放于dest指定的目录中
            },
        },


        /*服务环境*/
        connect: {
            server: {
                options: {
                    hostname:'*',
                    port: 8000,
                    open:{
                        target: 'http://localhost:<%= connect.server.options.port %>',
                    },
                    base: ''
                },
            },
        },

        /*HTML5验证*/
        validation: {
            options: {
                charset: 'utf-8',
                doctype: 'HTML5',
                failHard: true,
                reset: true,
                relaxerror: [
                    'Bad value X-UA-Compatible for attribute http-equiv on element meta.',
                    'Element img is missing required attribute src.'
                ]
            },
            files: {
                src: './*.html'
            }
        },

        /*WATCH 配置*/
        watch: {
            less: {
                files: ['less/**/*.less'],
                tasks: ['less', 'autoprefixer', 'cssmin','copy'],
                options: {
                    livereload: true,
                },
            },
            js: {
                files: ['js/src/*.js'],
                tasks: ['concat', 'uglify', 'jshint','copy'],
                options: {
                    livereload: true,
                },
            },
            html:{
                files: ['**/*.html','images/'],
                options: {
                    livereload: true,
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');  //server
    grunt.loadNpmTasks('grunt-contrib-watch');    //watch

    grunt.loadNpmTasks('grunt-contrib-concat');   //合并
    grunt.loadNpmTasks('grunt-contrib-uglify');   //压缩
    grunt.loadNpmTasks('grunt-contrib-jshint');   //检查
    grunt.loadNpmTasks('grunt-contrib-copy');     //复制

    grunt.loadNpmTasks('grunt-contrib-less');     //less
    grunt.loadNpmTasks('grunt-autoprefixer');     //autoprefixer
    grunt.loadNpmTasks('grunt-contrib-cssmin');   //cssmin

    grunt.loadNpmTasks('grunt-html-validation');  //validation


    grunt.registerTask('validate', ['validation']);
    grunt.registerTask('default', ['connect','watch']);
};
