# lease_manager
Work in progress

need to add an angular dialog to allow the staff to create a lot
the add leasee logic is bad, if we need to keep it, it will need to be modified to deal with each table seperately for data integrity, such as populating the lease holder into a pull down, similarly to the lot 

ability to change due and deliquent num days

see what is wrong with due date in detail page

add a feild in leaseholder table to see if customer wants payment reminder (bool)

add email client that sends a missing payment notication / payment reminder with default message(s), pulls leaseholders name, email, days/weeks/months late to build the body


modify up-to-date, 'late' logic to implement GlobalSettings table to see if todays date is later than due date, but less than grace period (late) or if after the due date AND greater than the grace_period (delenquent). if delenquent, add the days since last_payment_date subtracting the days between last_payment_date and first missed payment (1 month)