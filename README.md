# lease_manager

## breif description:

This application is accessible two different ways, either using (Django SSR) Server Side Rendered pages (not very stylized), or using the Angular client side application.

The Angular client side is secured using Authgaurd that is currently working with Django API framework and Javascript Web Tokens to authenticate the user using a token. this token in-turn is used to authenticate the API request based on the permissions associated with the user.

## Work in progress

update lease function insnt setup

see what is wrong with due date in detail page

add a feild in leaseholder table to see if customer wants payment reminder (bool)

add email client that sends a missing payment notication / payment reminder with default message(s), pulls leaseholders name, email, days/weeks/months late to build the body

I need to implement a certificate so I can utilize https:

I plan to put this entire package into a common virtual enviroment using Docker. Mostly done

# To launch Docker

## Django

1. navigate to the root of the Django app ..\lease_manager\back_end>.
2. Launch Docker Desktop (must be running)
3. Build the docker by running command "docker build -t django-app .". (Don't forget the . at the end of the command)
4. run the Docker container by running command "docker run -d -p 8000:8000 django-app"
   or maybe docker run --name django-app-container -d -p 8000:8000 -v ${PWD}/db.sqlite3:/app/db.sqlite3 django-app

### Django packages.

asgiref==3.7.2
boto3==1.34.48
botocore==1.34.48
Django==4.2.6
django-cors-headers==4.3.1
django-environ==0.11.2
django-storages==1.14.2
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.1
jmespath==1.0.1
PyJWT==2.8.0
python-dateutil==2.8.2
pytz==2023.3.post1
s3transfer==0.10.0
six==1.16.0
sqlparse==0.4.4
typing_extensions==4.9.0
tzdata==2024.1
urllib3==2.0.7

## Angular

1. navigate to the root of the Angular app ..\lease_manager\lease-manager>.
2. Launch Docker Desktop (must be running)
3. Build the docker by running command "docker build -t angular-app .". (Don't forget the . at the end of the command)
4. run the Docker container by running command "docker run -d -p 4200:80 angular-app"
5. Navigate to the localhost, in the browser

## better yet, just run the docker compose from the project root

docker-compose up --build

# done

modify up-to-date, 'late' logic to implement GlobalSettings table to see if todays date is later than due date, but less than grace period (late) or if after the due date AND greater than the grace_period (delenquent). if delenquent, add the days since last_payment_date subtracting the days between last_payment_date and first missed payment (1 month)

in the future I'd like to account for changes in due dates, like if the person changes the due date to two weeks later, it won't show as late or delinquent when the new due date hasn't yet occurred.

### To launch Back end server (virtaul enviroment)

Using command prompt or powershell:

1. navigate to \lease_manager\back_end\venv>
2. launch the virtual enviroment, run command: .\Scripts\Activate.ps1
3. navigate up one-level (venv) PS C:\Users\Zack\Documents\GitHub\lease_manager\back_end>
4. launch server, run command: python manage.py runserver

### To launch Client side server

Using command prompt or powershell:

1. navigate to \lease_manager\lease-manager>
2. run command: npm install
3. run command: ng serve click link in the message which should look something like this, "** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **. or you could simply navigate to the local host by typing the url into a browser.

The tempary admin username: admin, password: admin.

# Important todo

delete this code in thw login component`    // Note: Logging credentials is a security risk and should be avoided in production.
    console.log('Logging in with:', this.username, this.password);`

# known bugs

the details component will only displays "Days Past Due", if indeed the payment is past due using ngif, which appears to be working correctly (need to validate!). The value is incorrect, on the surface appears to be either two days off or is not using the correct values. the logic needs to be re-evauluated.

fix s3 storage for lease and reciepts (image or pdf)

update lease holder doesn't work

can't seem to add more than one lease without having to leave and renavigate to the page

if the page is refreshed, it attempts to reload at that route, it should be redirected to the index

need to add lease holder fields to the reports to identify the lease holder who made the payment.

the dialogs to manage datails are too small

# UML sequnce diagrams (more coming soon!)

Authentication UML
![Authentication UML](https://github.com/zackaryO/lease_manager/blob/main/UML/images/authenticationUML.png)

Dashboard UML
![Authentication UML](https://github.com/zackaryO/lease_manager/blob/main/UML/images/dashboardUML.png)
