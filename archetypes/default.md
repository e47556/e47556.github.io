---
date: '{{ .Date }}'
draft: false
title: '{{ slicestr (replace .File.ContentBaseName "_" " ") 11 | title }}'
resources:
- name: "featured-image"
  src: "cover.webp"
tags: []
---
