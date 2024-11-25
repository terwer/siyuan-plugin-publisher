import requests
import sys

# 已失效。无法实现
# python upload.py /Volumes/workspace/pictures/photo.jpg
if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("You must specify a file name.")
        sys.exit(-1)
    filePath = sys.argv[1]
    with open(filePath, 'rb') as f:
        # Upload File
        json_data = requests.post('https://telegra.ph/upload', files={'file': ('file', f, 'image/jpeg')}).json() # image/gif, image/jpeg, image/jpg, image/png, video/mp4
        print(f"upload res=>{json_data}")
        # get file URL
        filename = "https://telegra.ph" + json_data[0]['src']
        print(filename)