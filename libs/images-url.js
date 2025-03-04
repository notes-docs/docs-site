// image-uploader.js
const path = require('path')
const fs = require('fs')
const axios = require('axios')

module.exports = function (registry) {
    registry.treeProcessor(function () {
        this.process(async (doc) => {
            const config = {
                repo: doc.getAttribute('image-upload-repo') || 'notes-docs/note-image1',
                // branch: doc.getAttribute('github-branch') || 'main',
                baseDir: doc.getAttribute('image-base-dir') || 'assets',
            }

            const componentDir = doc.getAttribute('page-component-name') // Antora组件根目录

            try {
                const images = doc.findBy({ context: 'image', block: true })
                // console.dir(images)
                for (const image of images) {
                    // 获取原始图片路径（如 "image-2024-02-05-22-29-03-095.png"）
                    const rawPath = image.getAttribute('target')
                    if (!isLocalImage(rawPath)) return

                    image.setAttribute('target', formatPublicUrl(config.repo, config.baseDir, componentDir, rawPath))
                }
            } catch (err) {
                console.error('节点遍历失败:', err.stack)
            }

            return doc
        })
    })
}

function isLocalImage(path) {
    return !/^(https?:)?\/\//i.test(path)
}

function formatPublicUrl(repo, baseDir, componentDir, filename) {
    const [user, repoName] = repo.split('/')
    return `https://${user}.github.io/${repoName}/${baseDir}/${componentDir}/${filename}`
}
