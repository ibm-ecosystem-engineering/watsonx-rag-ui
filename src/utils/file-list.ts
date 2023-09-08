
export const fileListUtil = (fileList: FileList): File[] => {
    const files: File[] = [];

    for (let i = 0; i < fileList.length; i++) {
        const file: File | null = fileList.item(i);

        if (file !== null) {
            files.push(file);
        }
    }

    return files;
}
