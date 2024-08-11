from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Image,Table,TableStyle,PageBreak


class ReportGenerator(SimpleDocTemplate):
    def __init__(self,path:str,texts:dict,data:dict,images:dict = None,pagesize=letter):
        super().__init__(path,pagesize=pagesize)
        self.images = images
        self.texts = texts
        self.data = data
        self.elements = []
        self.styles = getSampleStyleSheet()
        self.image = lambda img : Image(img,width=1.5*inch,height=1.5*inch)
        self.isAvailable = lambda data : data

    def build(self):
        self.elements.append(Paragraph("Inspection Summary",self.styles['Title']))
        self.elements.append(Spacer(1,12))
        self.firstpage()
        self.tires()
        self.battery()
        self.exterior()
        self.brakes()
        self.engine()
        self.voc()
        super().build(self.elements)

    def table_style(self,table):
        table.setStyle(TableStyle([
            ('VALIGN',(0,0),(-1,-1),'TOP'),
            ('ALIGN',(0,0),(-1,-1),'CENTER'),
            ('GRID',(0,0),(-1,-1),1,'black')
        ]))
        self.elements.append(table)
        self.elements.append(Spacer(1,24))

    def paragraph(self,heading,title=None):
        self.elements.append(Paragraph(title if title else heading,self.styles["Heading2"]))
        self.elements.append(Spacer(1,12))
        self.elements.append(Paragraph(self.texts[heading],self.styles['BodyText']))
        self.elements.append(Spacer(1,24))
    
    def firstpage(self):
        data = [["Inspector Name",self.data["HEADERS"]["INAME"]],
                ["Inspector ID",self.data["HEADERS"]["IID"]],
                ["Date & Time",self.data["HEADERS"]["DATE&TIME"]],
                ["Location",self.data["HEADERS"]["LOCATION"]],
                ["Truck Serial Number",self.data["HEADERS"]["TSN"]],
                ["Truck Model",self.data["HEADERS"]["TM"]],
                ["Service Hours",self.data["HEADERS"]["SMH"]],
                ["Client",self.data["HEADERS"]["CLIENTNAME"]],
                ["CAT ID",self.data["HEADERS"]["CATID"]]]
        table = Table(data)
        self.table_style(table)
        self.paragraph("HEADERS",title = "Overview")      
        self.elements.append(PageBreak())


    def tires(self):
        self.paragraph("TIRES",title="Tires")
        data = [["Tires","Pressure","Condition"],
                ["Left Front Tire",self.data["TIRES"]["LFT"]["Pressure"],self.data["TIRES"]["LFT"]["Condition"]],
                ["Right Front Tire",self.data["TIRES"]["RFT"]["Pressure"],self.data["TIRES"]["RFT"]["Condition"]],
                ["Left Rear Tire",self.data["TIRES"]["LRT"]["Pressure"],self.data["TIRES"]["LRT"]["Condition"]],
                ["Right Rear Tire",self.data["TIRES"]["RRT"]["Pressure"],self.data["TIRES"]["RRT"]["Condition"]]]
        table = Table(data)
        self.table_style(table)
        
        data = [["Left Front Tire","Right Front Tire"],
                [self.image(self.images["TIRES"]["LFT"]),self.image(self.images["TIRES"]["RFT"])],
                ["Left Rear Tire","Right Rear Tire"],
                [self.image(self.images["TIRES"]["LRT"]),self.image(self.images["TIRES"]["RRT"])]]
        table = Table(data)
        self.table_style(table)
        self.elements.append(PageBreak())
       
    def battery(self):
        self.paragraph("BATTERY",title="Battery")
        data = [["Battery Make",self.data["BATTERY"]["Make"]],
                ["Replacement Date",self.data["BATTERY"]["RD"]],
                ["Voltage",self.data["BATTERY"]["Voltage"]],
                ["Water Level",self.data["BATTERY"]["Water Level"]],
                ["Condition",self.data["BATTERY"]["Condition"]["Damage"]],
                ["Leak / Rust",self.data["BATTERY"]["LR"]]]
        table = Table(data)
        self.table_style(table)


        addon = "" if self.isAvailable(self.images["BATTERY"]["Condition"]) else " not available."
        data = [[f"Condition{addon}", self.image(self.images["BATTERY"]["Condition"])]]
        table = Table(data)
        self.table_style(table)

        addon = "" if self.isAvailable(self.images["BATTERY"]["Images"]) else " not available."
        data =  [[f"Images{addon}", *[self.image(i) for i in self.images["BATTERY"]["Images"]]]]
        table = Table(data)
        self.table_style(table)
        self.elements.append(PageBreak())


    def exterior(self):
        self.paragraph("EXTERIOR",title="Exterior")
        data = [["Rust Dent or Damage",self.data["EXTERIOR"]["RND"]["Present"]],
                ["Oil Leak in Suspension",self.data["EXTERIOR"]["OLS"]]]
        table = Table(data)
        self.table_style(table)
        
        addon = "" if self.isAvailable(self.images["EXTERIOR"]["Physical"]) else " not available."
        rust = [[f"Rust, Dent or Damage{addon}",*[self.image(i) for i in self.images["EXTERIOR"]["Physical"]]]]
        rust_table = Table(rust)
        self.table_style(rust_table)

        addon = "" if self.isAvailable(self.images["EXTERIOR"]["Images"]) else " not available."
        images = [[f"Images{addon}", *[self.image(i) for i in self.images["EXTERIOR"]["Images"]]]]
        images_table = Table(images)
        self.table_style(images_table)
        self.elements.append(PageBreak())


    def brakes(self):
        self.paragraph("BRAKES",title="Brakes")
        data = [["Brake Fluid Level",self.data["BRAKES"]["BFL"]],
                ["Front Brake Condition",self.data["BRAKES"]["FBC"]],
                ["Rear Brake Condition",self.data["BRAKES"]["RBC"]],
                ["Emergency Brake",self.data["BRAKES"]["EB"]]]
        table = Table(data)
        self.table_style(table)

        addon = "" if self.isAvailable(self.images["BRAKES"]["Images"]) else " not available."
        images = [[f"Images{addon}", *[self.image(i) for i in self.images["BRAKES"]["Images"]]]]
        images_table = Table(images)
        self.table_style(images_table)
        self.elements.append(PageBreak())

    def engine(self):
        self.paragraph("ENGINE",title="Engine")
        data = [["Rust, Dent or Damage",self.data["ENGINE"]["RND"]["Present"]],
                ["Engine Oil Condition",self.data["ENGINE"]["EOC"]],
                ["Engine Oil Color",self.data["ENGINE"]["EOColor"]],
                ["Brake Fluid Condition",self.data["ENGINE"]["BFC"]],
                ["Brake Fluid Color",self.data["ENGINE"]["BFColor"]],
                ["Oil Leak in Engine",self.data["ENGINE"]["OLE"]]]
        table = Table(data)
        self.table_style(table)

        addon = "" if self.isAvailable(self.images["ENGINE"]["Physical"]) else " not available."
        rust = [[f"Rust, Dent or Damage{addon}",*[self.image(i) for i in self.images["ENGINE"]["Physical"]]]]
        rust_table = Table(rust)
        self.table_style(rust_table)

        addon = "" if self.isAvailable(self.images["ENGINE"]["Images"]) else " not available."
        images = [[f"Images{addon}", *[self.image(i) for i in self.images["ENGINE"]["Images"]]]]
        images_table = Table(images)
        self.table_style(images_table)
        self.elements.append(PageBreak())
    
    def voc(self):
        self.paragraph("CUSTOMER",title="Voice of Customer")

        addon = "" if self.isAvailable(self.images["Customer"]) else " not available."

        images = [[f"Images{addon}", *[self.image(i) for i in self.images["Customer"]]]]
        images_table = Table(images)
        self.table_style(images_table)
        self.elements.append(PageBreak())





