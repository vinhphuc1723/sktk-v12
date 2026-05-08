#!/usr/bin/env python3
"""
Generate SKTK V12 PWA icons in all required sizes.
Run: python3 generate_icons.py
Requires: pip install Pillow --break-system-packages
"""
import os, math

try:
    from PIL import Image, ImageDraw, ImageFont
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("Pillow not found. Installing...")
    os.system("pip install Pillow --break-system-packages -q")
    from PIL import Image, ImageDraw, ImageFont

SIZES = [72, 96, 128, 144, 152, 180, 192, 512, 32]
os.makedirs("icons", exist_ok=True)

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

RED       = hex_to_rgb('#c8102e')
RED_DARK  = hex_to_rgb('#9b0c22')
BLUE_DARK = hex_to_rgb('#1a3a6b')
WHITE     = (255, 255, 255)
GREEN_VTV = hex_to_rgb('#2db34a')
RED_VTV   = hex_to_rgb('#e8254a')

def draw_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d   = ImageDraw.Draw(img)
    pad = max(2, size // 20)
    r   = size // 8

    # Background gradient (simulate with red)
    for y in range(size):
        t = y / size
        rc = int(RED_DARK[0] + (RED[0]-RED_DARK[0])*t)
        gc = int(RED_DARK[1] + (RED[1]-RED_DARK[1])*t)
        bc = int(RED_DARK[2] + (RED[2]-RED_DARK[2])*t)
        d.line([(0,y),(size,y)], fill=(rc,gc,bc,255))

    # Rounded rect mask
    mask = Image.new('L', (size, size), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0,0,size-1,size-1], radius=r*2, fill=255)
    img.putalpha(mask)

    # White inner box (VTV area)
    box_size = int(size * 0.45)
    box_x    = int(size * 0.08)
    box_y    = int(size * 0.15)
    d.rounded_rectangle([box_x, box_y, box_x+box_size, box_y+box_size], radius=max(3,size//20), fill=WHITE+(255,))

    # VTV text area
    center_x = box_x + box_size // 2
    center_y = box_y + box_size // 2

    # Draw TV shape (simplified)
    tv_w = int(box_size * 0.8)
    tv_h = int(box_size * 0.65)
    tv_x = box_x + (box_size - tv_w)//2
    tv_y = box_y + (box_size - tv_h)//2
    d.rounded_rectangle([tv_x, tv_y, tv_x+tv_w, tv_y+tv_h], radius=max(2,size//30), fill=BLUE_DARK+(255,))

    # Inner screen
    sc_pad = max(2, tv_w//8)
    d.rectangle([tv_x+sc_pad, tv_y+sc_pad, tv_x+tv_w-sc_pad, tv_y+tv_h-sc_pad], fill=WHITE+(255,))

    # VTV letters
    fs = max(6, int(box_size * 0.18))
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", fs)
    except:
        font = ImageFont.load_default()

    # V (red)
    tx = tv_x + sc_pad + 2
    ty = tv_y + sc_pad + 2
    seg_w = max(1, (tv_w - sc_pad*2 - 4) // 3)
    d.text((tx, ty), "V", fill=RED_VTV+(255,), font=font)
    d.text((tx+seg_w, ty), "T", fill=BLUE_DARK+(255,), font=font)
    d.text((tx+seg_w*2, ty), "V", fill=GREEN_VTV+(255,), font=font)

    # Right text area
    txt_x = box_x + box_size + int(size*0.04)
    txt_w = size - txt_x - int(size*0.06)

    # Red bar background
    bar_h = int(size * 0.35)
    bar_y = int(size * 0.32)
    d.rounded_rectangle([txt_x, bar_y, txt_x+txt_w, bar_y+bar_h], radius=max(2,size//25), fill=RED+(220,))

    # Text on bar
    fs2 = max(5, int(size * 0.07))
    try:
        font2 = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", fs2)
    except:
        font2 = font

    line1 = "BAN VĂN NGHỆ"
    line2 = "P.SÂN KHẤU"
    line3 = "TẠP KỸ"
    lh = fs2 + 2
    ty_start = bar_y + (bar_h - lh*3)//2
    for i, line in enumerate([line1, line2, line3]):
        d.text((txt_x+4, ty_start + i*lh), line, fill=WHITE+(255,), font=font2)

    return img

def generate_all():
    print(f"Generating {len(SIZES)} icon sizes...")
    for size in SIZES:
        img = draw_icon(size)
        path = f"icons/icon-{size}.png"
        img.save(path, 'PNG', optimize=True)
        print(f"  ✓ {path} ({size}×{size})")
    print("\nAll icons generated successfully!")
    print("Icons saved in: ./icons/")

if __name__ == '__main__':
    generate_all()
