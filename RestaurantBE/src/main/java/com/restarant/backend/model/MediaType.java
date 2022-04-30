package com.restarant.backend.model;

import lombok.Data;
import lombok.Getter;

@Getter
public enum MediaType {

    VIDEO("VIDEO"), IMAGE("IMAGE"), UNKNOW("UNKNOW");

    private String type;

    MediaType(String type) {
        this.type = type;
    }

    @Getter
    public enum VideoType {
        MP4(".mp4"), AVI(".avi"), WMV(".wmv"), MKV(".mkv");

        private String type;

        VideoType(String type) {
            this.type = type;
        }

        public static boolean isVideoType(String url) {
            VideoType[] videoTypes = VideoType.values();
            for (VideoType videoType : videoTypes) {
                if (url.endsWith(videoType.getType())) {
                    return true;
                }
            }
            return false;
        }
    }

    @Getter
    public enum ImageType {
        JPG(".jpg"), JPEG(".jpeg"), PNG(".png");

        private String type;

        ImageType(String type) {
            this.type = type;
        }

        public static boolean isImageType(String url) {
            ImageType[] imageTypes = ImageType.values();
            for (ImageType imageType : imageTypes) {
                if (url.endsWith(imageType.getType())) {
                    return true;
                }
            }
            return false;
        }
    }

    public static MediaType getMediaType(String url) {
        if (VideoType.isVideoType(url)) {
            return MediaType.VIDEO;
        }
        if (ImageType.isImageType(url)) {
            return MediaType.IMAGE;
        }
        return MediaType.UNKNOW;
    }
}
