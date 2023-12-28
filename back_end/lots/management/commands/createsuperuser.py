from django.contrib.auth.management.commands import createsuperuser
from django.core.management import CommandError
from django.contrib.auth import get_user_model

class Command(createsuperuser.Command):
    def handle(self, *args, **options):
        User = get_user_model()
        database = options.get('database')

        # Prompt for standard fields
        username = input("Username: ")
        email = input("Email address: ")
        password = None
        while password is None:
            password1 = input("Password: ")
            password2 = input("Password (again): ")
            if password1 == password2:
                password = password1
            else:
                print("Passwords do not match. Please try again.")

        # Prompt for user_type
        user_type = None
        while user_type is None:
            try:
                user_type_input = input("User Type (1 for staff, 2 for customer): ")
                user_type = int(user_type_input)
                if user_type not in [1, 2]:
                    print("Invalid input. Please enter 1 for staff or 2 for customer.")
                    user_type = None
            except ValueError:
                print("Please enter a valid number.")

        # Create the superuser
        try:
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                user_type=user_type
            )
            user.save(using=database)
        except Exception as e:
            raise CommandError("Error: %s" % e)
