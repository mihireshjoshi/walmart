import qrcode

def generate_qr_code(section_name, filename):
    # Create an instance of QRCode
    qr = qrcode.QRCode(
        version=1,  # controls the size of the QR Code
        error_correction=qrcode.constants.ERROR_CORRECT_L,  # controls the error correction used for the QR Code
        box_size=10,  # size of each box in the QR code grid
        border=4,  # thickness of the border (minimum is 4)
    )

    # Add the section name as data
    qr.add_data(section_name)
    qr.make(fit=True)

    # Create an image from the QR Code instance
    img = qr.make_image(fill_color="black", back_color="white")

    # Save the image to a file
    img.save(filename)

# Example usage
sections = [
    "Entrance",
    "Checkout",
    "Utensils",
    "Cooking",
    "Vegetables"
]

# Generate a QR code for each section
for section in sections:
    filename = f"{section.replace(' ', '_').lower()}.png"  # Creates a filename like entrance.png
    generate_qr_code(section, filename)
    print(f"QR Code for {section} saved as {filename}")
