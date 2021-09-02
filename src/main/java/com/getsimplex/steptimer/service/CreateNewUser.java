package com.getsimplex.steptimer.service;

import com.google.gson.Gson;
import com.getsimplex.steptimer.model.User;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import org.apache.commons.codec.digest.DigestUtils;
import spark.Request;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import com.getsimplex.steptimer.utils.*;

import java.util.function.Predicate;

/**
 * Created by Mandy on 10/4/2016.
 */
public class CreateNewUser {

    private static Gson gson = new Gson();
    private static JedisClient jedisClient = new JedisClient();

    public static String handleRequest (Request request) throws Exception{
        String newUserRequest = request.body();
        User createUser = gson.fromJson(newUserRequest, User.class);
        return createUser(createUser);
    }


    public static String createUser(User createUser) throws Exception{
        User addUser = new User();

        addUser.setLocked(false);//new users start off with a clean slate


        String email = createUser.getEmail();
        String phone = createUser.getPhone();
        String formattedPhone = SendText.getFormattedPhone(phone);
        createUser.setUserName(formattedPhone);
        String bday = createUser.getBirthDate();
        String deviceId = createUser.getDeviceNickName();


        if (createUser.getUserName() != null && !createUser.getUserName().isEmpty()) {

            Optional<User> existingUser = JedisData.getEntityById(User.class,  createUser.getUserName());

            if (existingUser.isPresent()) {

                throw new Exception("Username already exists");

            } else {
                addUser.setUserName(createUser.getUserName());
            }
        }


        if (email != null && !email.isEmpty()) {
                addUser.setEmail(email);
        }

        if (phone != null && !phone.isEmpty()) {

            addUser.setPhone(formattedPhone);
        }


        if (bday != null ){
            String birthdate = bday;
            addUser.setBirthDate(birthdate);
        }

        if (deviceId != null && !deviceId.isEmpty()){
            addUser.setDeviceNickName(deviceId);
        }


        //SAVE USER TO REDIS
        JedisData.loadToJedis(addUser, addUser.getPhone(), 0l);

        return "Welcome: " + addUser.getUserName() + " Your account has been created, please login.";

    }

}
