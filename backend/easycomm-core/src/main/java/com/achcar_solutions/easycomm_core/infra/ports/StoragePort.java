package com.achcar_solutions.easycomm_core.infra.ports;

public interface StoragePort {
    String uploadFile(byte[] fileData, String fileName, String contentType);

    byte[] downloadFile(String s3ObjectKey);

    void deleteFile(String s3ObjectKey);
}
