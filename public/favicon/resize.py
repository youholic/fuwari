from PIL import Image

# 打开图片
img = Image.open("favicon.png")

# 调整分辨率，比如改成 32x32
img_resized = img.resize((32, 32), Image.LANCZOS)
img_resized.save("favicon-32.png")

img_resized = img.resize((128, 128), Image.LANCZOS)
img_resized.save("favicon-128.png")

img_resized = img.resize((180, 180), Image.LANCZOS)
img_resized.save("favicon-180.png")

img_resized = img.resize((192, 192), Image.LANCZOS)  
img_resized.save("favicon-192.png")
